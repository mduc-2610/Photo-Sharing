export const formatDate = (dateTimeString) => {
  const date = new Date(dateTimeString);

  const day = date.getDate();
  const month = new Intl.DateTimeFormat("en", { month: "long" }).format(date);
  const year = date.getFullYear();

  const hours = date.getHours() % 12 || 12;
  const minutes = date.getMinutes();
  const period = date.getHours() < 12 ? "AM" : "PM";

  const formattedDate = `${day} ${month}, ${year} at ${hours}:${
    minutes < 10 ? "0" : ""
  }${minutes} ${period}`;

  return formattedDate;
};
