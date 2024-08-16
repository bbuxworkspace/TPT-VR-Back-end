const errorMiddleware = (err, res) => {
    return res.status(401).json({ message: 'Error' });
  };
  
  module.exports = errorMiddleware;
  