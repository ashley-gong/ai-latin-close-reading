export const fetchExample = async () => {
  const response = await fetch('https://api.ai-latin-close-reading.online/api/home');
  const data = await response.json();
  return data;
};

export const query = async (dataToSend) => {
  try {
    const response = await fetch('https://api.ai-latin-close-reading.online/api/query', {
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