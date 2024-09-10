// Post request to upload file

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("http://localhost:8000/report", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload file");
    }
    
    const data = await response.json();

    return data.data;

  } catch (error) {
    console.error("Failed to upload file", error);
  }
};

export { uploadFile };
