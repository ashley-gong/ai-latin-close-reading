export const fetchExample = async () => {
  const response = await fetch('http://127.0.0.1:8080/api/home');
  const data = await response.json();
  return data;
};

export const query = async (dataToSend) => {
  try {
    const response = await fetch('http://127.0.0.1:8080/api/query', {
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
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};