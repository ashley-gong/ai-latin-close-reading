export const fetchExample = async () => {
  const response = await fetch('https://159.223.163.12/api/home');
  const data = await response.json();
  return data;
};

export const query = async (dataToSend) => {
  try {
    const response = await fetch('https://159.223.163.12/api/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
      console.log(response.status);
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};