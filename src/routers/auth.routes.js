const router = require("express").Router();
const { login } = require("../controllers/adminController");
const AdminValidations = require("../middlewares/validations/adminValidation");
const employeeController = require("../controllers/employeeController");

router.post("/create-employee", employeeController.createEmployee);
router.get("/getAll-employee", employeeController.getAllEmployees);
router.get("/get-employee/:id", employeeController.getEmployeeById);
router.put("/update-employee/:id", employeeController.updateEmployeeById);
router.delete("/delete-employee/:id", employeeController.deleteEmployeeById);

router.post("/login", AdminValidations.login, login);

module.exports = router;
