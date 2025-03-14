const authorize = (permission) => {
  return async (req, res, next) => {
    const userPermissions = req.user.permissions || []

    if (userPermissions.includes(permission)) {
      next()
    } else {
      res
        .status(403)
        .send("You don't have the permission to access this resource!")
    }
  }
}

export { authorize }
