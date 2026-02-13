const generateEmployeeId = async (Candidate) => {
  const year = new Date().getFullYear();
  const prefix = `EMP${year}`;
  
  // Find the last employee ID created this year
  const lastCandidate = await Candidate.findOne({
    'adminInfo.employeeId': new RegExp(`^${prefix}`)
  }).sort({ 'adminInfo.employeeId': -1 });
  
  let nextNumber = 1;
  
  if (lastCandidate && lastCandidate.adminInfo.employeeId) {
    const lastNumber = parseInt(lastCandidate.adminInfo.employeeId.replace(prefix, ''));
    nextNumber = lastNumber + 1;
  }
  
  // Pad with zeros to make it 4 digits
  const paddedNumber = String(nextNumber).padStart(4, '0');
  
  return `${prefix}${paddedNumber}`;
};

module.exports = generateEmployeeId;
