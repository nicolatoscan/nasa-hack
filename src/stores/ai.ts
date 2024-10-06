import { GoogleGenerativeAI } from '@google/generative-ai';

export async function fetchWeatherData(latitude: number, longitude: number) {

  let weatherData = {};
  const end = new Date().toISOString().split('T')[0]; // Current date
  console.log(end);

  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=2010-01-01&end_date=${end}&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,daylight_duration,sunshine_duration,precipitation_sum,rain_sum,snowfall_sum,precipitation_hours,wind_speed_10m_max,wind_gusts_10m_max&timezone=auto`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    // Process the data for the various metrics
    const avg_rainfall = data.daily.precipitation_sum.reduce((acc: number, val: number) => acc + val, 0) / data.daily.precipitation_sum.length;
    console.log(avg_rainfall);
    const avg_max_temp = data.daily.temperature_2m_max.reduce((acc: number, val: number) => acc + val, 0) / data.daily.temperature_2m_max.length;
    const max_temp = Math.max(...data.daily.temperature_2m_max);
    const avg_min_temp = data.daily.temperature_2m_min.reduce((acc: number, val: number) => acc + val, 0) / data.daily.temperature_2m_min.length;
    const min_temp = Math.min(...data.daily.temperature_2m_min);
    const avg_sunshine = data.daily.sunshine_duration.reduce((acc: number, val: number) => acc + val, 0) / data.daily.sunshine_duration.length;
    const avg_snowfall = data.daily.snowfall_sum.reduce((acc: number, val: number) => acc + val, 0) / data.daily.snowfall_sum.length;
    const avg_wind_speed = data.daily.wind_speed_10m_max.reduce((acc: number, val: number) => acc + val, 0) / data.daily.wind_speed_10m_max.length;
    const max_wind_speed = Math.max(...data.daily.wind_speed_10m_max);
    // Add the data for the current day to the weatherData array

    const url2 = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,soil_moisture_0_to_1cm,soil_moisture_1_to_3cm,soil_moisture_3_to_9cm,soil_moisture_9_to_27cm,soil_moisture_27_to_81cm`;
    const response2 = await fetch(url2);
    const data2 = await response2.json();

    const moisture1_3 = data2.hourly.soil_moisture_1_to_3cm.reduce((acc: number, val: number) => acc + val, 0) / data2.hourly.soil_moisture_1_to_3cm.length;
    const moisture3_9 = data2.hourly.soil_moisture_3_to_9cm.reduce((acc: number, val: number) => acc + val, 0) / data2.hourly.soil_moisture_3_to_9cm.length;
    const moisture9_27 = data2.hourly.soil_moisture_9_to_27cm.reduce((acc: number, val: number) => acc + val, 0) / data2.hourly.soil_moisture_9_to_27cm.length;
    const moisture27_81 = data2.hourly.soil_moisture_27_to_81cm.reduce((acc: number, val: number) => acc + val, 0) / data2.hourly.soil_moisture_27_to_81cm.length;

    weatherData = {
      longitude: longitude,
      latitude: latitude,
      moisture1_3: Math.round(moisture1_3 * 100) / 100,
      moisture3_9: Math.round(moisture3_9 * 100) / 100,
      moisture9_27: Math.round(moisture9_27 * 100) / 100,
      moisture27_81: Math.round(moisture27_81 * 100) / 100,
      avg_rainfall: Math.round(avg_rainfall * 100) / 100,
      avg_max_temp: Math.round(avg_max_temp * 100) / 100,
      max_temp: Math.round(max_temp * 100) / 100,
      avg_min_temp: Math.round(avg_min_temp * 100) / 100,
      min_temp: Math.round(min_temp * 100) / 100,
      avg_sunshine: Math.round(avg_sunshine * 100) / 100,
      avg_snowfall: Math.round(avg_snowfall * 100) / 100,
      avg_wind_speed: Math.round(avg_wind_speed * 100) / 100,
      max_wind_speed: Math.round(max_wind_speed * 100) / 100,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
  return weatherData;
};

export function generateWeatherTexts(weatherData: any) {
  return [
    `Average rainfall: ${weatherData.avg_rainfall}mm`,
    `Average maximum temperature: ${weatherData.avg_max_temp}°C`,
    `Maximum temperature: ${weatherData.max_temp}°C`,
    `Average minimum temperature: ${weatherData.avg_min_temp}°C`,   
    `Minimum temperature: ${weatherData.min_temp}°C`,
    `Average sunshine duration: ${weatherData.avg_sunshine} hours`,
    `Average snowfall: ${weatherData.avg_snowfall}mm`,
    `Average maximum wind speed: ${weatherData.avg_wind_speed}m/s`,
    `Maximum wind speed: ${weatherData.max_wind_speed}m/s`,
    `Moisture from 1cm to 3cm: ${weatherData.moisture1_3}`,
    `Moisture from 3cm to 9cm: ${weatherData.moisture3_9}`,
    `Moisture from 9cm to 27cm: ${weatherData.moisture9_27}`,
    `Moisture from 27cm to 81cm: ${weatherData.moisture27_81}`
  ]
}

function generateCropSuggestionPrompt(weatherData: any) {
  const prompt = `
      You will be given coordinates in the world, the current date and the moisture level of the soil at that point.
      You need to predict the type of crop that can be grown at that point.
      do a top 3 prediction of the crop that can be grown at that point.
      - Date: ${weatherData.date}
      - Longitude: ${weatherData.longitude}
      - Latitude: ${weatherData.latitude}
      - Moisture from 1cm to 3cm: ${weatherData.moisture1_3}
      - Moisture from 3cm to 9cm: ${weatherData.moisture3_9}
      - Moisture from 9cm to 27cm: ${weatherData.moisture9_27}
      - Moisture from 27cm to 81cm: ${weatherData.moisture27_81}
      - average annual rainfall: ${weatherData.avg_rainfall}
      - average maximum temperature: ${weatherData.avg_max_temp}
      - maximum temperature: ${weatherData.max_temp}
      - average minimum temperature: ${weatherData.avg_min_temp}
      - minimum temperature: ${weatherData.min_temp}
      - average sunshine duration: ${weatherData.avg_sunshine}
      - average snowfall: ${weatherData.avg_snowfall}
      - average maximum wind speed: ${weatherData.avg_max_wind_speed}
      - maximum wind speed: ${weatherData.max_wind_speed}

      reply with the top 3 crops that can be grown at this point.
      if you reply with something else, you will be disqualified.
      This are the crops that can be grown at this point:
      - barley
      - corn
      - millet
      - rice
      - sorghum
      - wheat
      - palm
      - soybean
      - peanuts
      - sunflower
      - rapeseed
      - cotton
      reply in json format with name,description and the confidence level of the crop.
      reply in json. e.g {"name":"corn","description":"corn is a cereal crop that is grown in warm climates","confidence":0.9}
  `;
  return prompt;
};

export async function generateText(weatherData: any) {
  const prompt = generateCropSuggestionPrompt(weatherData)
  const genAI = new GoogleGenerativeAI('AIzaSyCFh1W2ZCgDTnGvc9OXCfW3YpQB2dbq8wE');
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(prompt);
  let json = (result.response.text() as any).replaceAll("```", "").replace("json", "");
  return JSON.parse(json) as { name: string, description: string }[];
};