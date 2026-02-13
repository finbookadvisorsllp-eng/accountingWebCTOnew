const calculateProfilePercentage = (candidate) => {
  const status = candidate.status;
  
  switch(status) {
    case 'INTERESTED':
      return 20;
    case 'ALLOWED_EXITED':
      return 20;
    case 'EXITED':
      return 50;
    case 'APPROVED':
      return 80;
    case 'ACTIVE':
      return 100;
    default:
      return 0;
  }
};

module.exports = calculateProfilePercentage;
