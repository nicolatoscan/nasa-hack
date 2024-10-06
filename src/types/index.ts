export type Campo = {
  guid?: string;
  name: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  size?: number;
}