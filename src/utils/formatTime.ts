export const getLocalTime = (time: string) => {
  const hours = time.split(":")[0];
  const minutes = time.split(":")[1];
  const utc_time = new Date();
  utc_time.setUTCHours(+hours);
  utc_time.setUTCMinutes(+minutes);
  const local_hours = utc_time.getHours();
  const local_minutes = utc_time.getMinutes();
  return `${local_hours.toString().padStart(2, "0")}:${local_minutes.toString().padStart(2, "0")}:00`;
};

export const getUTCTime = (time: string) => {
  const hours = time.split(":")[0];
  const minutes = time.split(":")[1];
  const local_time = new Date();
  local_time.setHours(+hours);
  local_time.setMinutes(+minutes);
  const utc_hours = local_time.getUTCHours();
  const utc_minutes = local_time.getUTCMinutes();
  return `${utc_hours.toString().padStart(2, "0")}:${utc_minutes.toString().padStart(2, "0")}:00`;
};
