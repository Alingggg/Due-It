function generateJoinCode() {
  const length = 8;
  const chars = "abcdefghijklmnopqrstuvwxyz23456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default generateJoinCode;
