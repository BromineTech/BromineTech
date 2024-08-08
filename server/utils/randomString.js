function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  
  function getRandomString() {
    const minLength = 20;
    const maxLength = 25;
    const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
    return generateRandomString(length);
  }
  
  module.exports = getRandomString;