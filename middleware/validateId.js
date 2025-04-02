const validateId = (param) => {
  return (req, res, next) => {
    if (!Number.isInteger(Number(req.params[param]))) {
      return res.status(400).json({ error: `${param} must be a valid number` });
    }
    next();
  };
};

module.exports = validateId;
