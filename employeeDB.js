var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Pablacas10314!",
  database: "employee_DB"
});

connection.connect(function (err) {
  if (err) throw err;
  start();
});

function start() {
  inquirer
    .prompt({
      name: "choice",
      type: "list",
      message: "What would you like to do?",
      choices: ["Add employee", "Add department", "Add role", "View employee", "View department", "View role", "Update employee role"]
    })
    .then(function (answer) {
      if (answer.choice === "Add employee") {
        addEmployee()
      }
      else if (answer.choice === "Add department") {
        addDepartment()
      }
      else if (answer.choice === "Add role") {
        addRole()
      }
      else if (answer.choice === "View employee") {
        viewEmployee()
      }
      else if (answer.choice === "View department") {
        viewDepartment()
      }
      else if (answer.choice === "View role") {
        viewRole()
      }
      else if (answer.choice === "Update employee role") {
        updateRole()
      }
      else {
        connection.end();
      }
    });
}

// function to handle posting new items up for auction
function addEmployee() {

  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "What is the employees first name?"
      },
      {
        name: "lastName",
        type: "input",
        message: "What is the employees last name?"
      },
      {
        name: "role_id",
        type: "input",
        message: "What is the employees role ID?",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "manager_id",
        type: "input",
        message: "What is the employees' manager's ID?",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function (answer) {
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.firstName,
          last_name: answer.lastName,
          role_id: answer.role_id,
          manager_id: answer.manager_id
        },
        function (err) {
          if (err) throw err;
          console.log("Employee added successfully!");
          start();
        }
      );
    });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        name: "departmentName",
        type: "input",
        message: "What is the department name?"
      }
    ])
    .then(function (answer) {
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: answer.departmentName
        },
        function (err) {
          if (err) throw err;
          console.log("Department added successfully!");
          start();
        }
      );
    });
}

function addRole() {

  inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: "What is the job title?"
      },
      {
        name: "salary",
        type: "input",
        message: "Show me the money?",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      },
      {
        name: "department_id",
        type: "input",
        message: "In what department?",
      }
    ])
    .then(function (answer) {
      connection.query(
        "INSERT INTO role SET ?",
        {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.department_id
        },
        function (err) {
          if (err) throw err;
          console.log("role added successfully!");
          start();
        }
      );
    });
}

function viewEmployee() {
  connection.query(
    "SELECT * FROM employee", function (err, result) {
      if (err) throw err;
      var l = result.length;
      for (i = 0; i < l; i++) {
        var first = result[i].first_name
        var last = result[i].last_name
        console.log(first + " " + last)
      }
      start();
    }
  );
}

function viewRole() {
  connection.query(
    "SELECT * FROM role", function (err, result) {
      if (err) throw err;
      var l = result.length;
      for (i = 0; i < l; i++) {
        var title = result[i].title
        var salary = result[i].salary
        console.log(title + " " + salary)
      }
      start();
    }
  );

}

function viewDepartment() {
  connection.query(
    "SELECT * FROM department", function (err, result) {
      if (err) throw err;
      var l = result.length;
      for (i = 0; i < l; i++) {
        var name = result[i].name
        console.log(name)
      }
      start();
    }
  );
}

async function updateRole() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Which employee's role would tou like to update?",
        name: "employeeUpdate"
      },

      {
        type: "input",
        message: "What do you want the new role ID to be?",
        name: "updateRole"
      }
    ])
    .then(function(answer) {
      connection.query('UPDATE employee SET role_id=? WHERE first_name= ?',[answer.updateRole, answer.employeeUpdate],function(err, res) {
        if (err) throw err;
        console.log("Update Succesfull");
        start();
      });
    });
}
