export type EmergencyHotline = {
  name: string;
  phone: string;
  description: string;
  available: string;
};

export type EmergencyHotlinesResponse = {
  data: EmergencyHotline[];
};
