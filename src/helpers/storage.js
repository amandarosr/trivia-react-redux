export const getSaved = () => {
  const dataPlayer = localStorage.getItem('ranking');
  return dataPlayer ? JSON.parse(dataPlayer) : [];
};
export const savePlayer = (player) => {
  const allPlayer = getSaved();
  const newPlayer = [...allPlayer, player];
  localStorage.setItem('ranking', JSON.stringify(newPlayer));
};
