function getKolkataTime() {
  const now = new Date();

  // Get UTC time in milliseconds
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;

  // Add 5 hours 30 minutes for IST
  const istOffset = 5.5 * 60 * 60000; // 5 hours 30 minutes in ms

  const istTime = new Date(utc + istOffset);

  // Format as 'YYYY-MM-DD HH:MM:SS'
  const yyyy = istTime.getFullYear();
  const mm = String(istTime.getMonth() + 1).padStart(2, '0');
  const dd = String(istTime.getDate()).padStart(2, '0');

  const hh = String(istTime.getHours()).padStart(2, '0');
  const min = String(istTime.getMinutes()).padStart(2, '0');
  const sec = String(istTime.getSeconds()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${sec}`;
}


module.exports = { getKolkataTime }