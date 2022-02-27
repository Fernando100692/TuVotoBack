module.exports = {
  routes: [
    {
      method: "GET",
      path: "/students/findByStudentCode/:student_code",
      handler: "student.findByStudentCode",
    },
    {
      method: "GET",
      path: "/students/user_permission/:id",
      handler: "student.findByUserCodePermission",
    },
    {
      method: "GET",
      path: "/students/by_user_perm/:id",
      handler: "student.findStudentByUserPermission",
    },
    {
      method: "POST",
      path: "/students/createMany",
      handler: "student.createMany",
    },
    {
      method: "POST",
      path: "/students/createManyUsers",
      handler: "student.createManyUsers",
    },
  ],
};
