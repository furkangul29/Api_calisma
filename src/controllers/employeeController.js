const Employee = require("../models/employeeModel");

const createEmployee = async (req, res) => {
  try {
    const employee = new Employee(req.body);
    const savedEmployee = await employee.save();
    return res.status(201).json({
      success: true,
      data: savedEmployee,
      message: "Çalışan kaydı başarı ile oluşturuldu.",
    });
  } catch (error) {
    console.error("Hata : ", error);
    return res.status(500).json({
      success: false,
      message: "Girilen çalışan bilgileri sisteme kaydedilemedi!",
    });
  }
};

const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    return res.status(200).json({
      success: true,
      data: employees,
      message: "Tüm Çalışan Bilgileri başarı ile Getirildi.",
    });
  } catch (error) {
    console.error("Hata : ", error);
    return res.status(500).json({
      success: false,
      message: "Kayıtlar getirilirken bir hata oluştu!",
    });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Çalışan bilgisi bulunamadı",
      });
    }
    return res.status(200).json({
      success: true,
      data: employee,
      message: "Çalışan Bilgisi Başarı ile Getirildi",
    });
  } catch (error) {
    console.error("Hata : ", error);
    return res.status(500).json({
      success: false,
      message: "Kayıt getirilirken bir hata oluştu!",
    });
  }
};

const updateEmployeeById = async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEmployee) {
      return res.status(404).json({
        success: false,
        message: "Çalışan bilgisi bulunamadı",
      });
    }
    return res.status(200).json({
      success: true,
      data: updatedEmployee,
      message: "Çalışan Bilgileri Başarı ile güncellendi.",
    });
  } catch (error) {
    console.error("Hata : ", error);
    return res.status(500).json({
      success: false,
      message: "Çalışan Bilgileri Güncellenirken bir hata oluştu!",
    });
  }
};

const deleteEmployeeById = async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({
        success: false,
        message: "Çalışan bilgisi bulunamadı",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Çalışan Bilgileri Sistemden Başarı İle silindi.",
    });
  } catch (error) {
    console.error("Hata : ", error);
    return res.status(500).json({
      success: false,
      message: "Çalışan Bilgileri Silinirken bir hata ile karşılaşıldı!",
    });
  }
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployeeById,
  deleteEmployeeById,
};
