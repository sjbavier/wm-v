export const safeJson = async (res: string) => {
  try {
    const decoded = JSON.parse(res);
    return decoded;
  } catch (err) {
    console.log('error to be replaced with global error handler', err);
  }
};
