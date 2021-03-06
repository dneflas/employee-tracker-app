const db = require('../db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');

class Tracker {
    mainMenu(){
        inquirer.prompt([
            {
                type: 'list',
                name: 'task',
                message: 'What would you like to do?',
                choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Exit']
            }
        // switch case for each activity
        ]).then(selectedTask => {
            switch(selectedTask.task){
                case 'View all departments':
                    this.viewAllDepartments();
                    break;
                case 'View all roles':
                    this.viewAllRoles();
                    break;
                case 'View all employees':
                    this.viewAllEmployees();
                    break;
                case 'Add a department':
                    this.addNewDepartmentPrompt();
                    break;
                case 'Add a role':
                    this.addNewRolePrompt();
                    break;
                case 'Add an employee':
                    this.addNewEmployeePrompt();
                    break;
                case 'Update an employee role':
                    this.updateEmployeeRolePrompt();
                    break;
                default:
                    console.log('Goodbye!')
                    db.end();
                    break;
            };
        });
    };
    viewAllDepartments(){
        const sql = `SELECT * FROM departments`;

        db.query(sql, (err, result) => {
            if(err) {
                console.log(err);
                return;
            }
            console.table(result);
            return this.mainMenu();
        });
    };
    addNewDepartmentPrompt(){
        inquirer.prompt({
            type: 'input',
            name: 'name',
            message: 'What is the name of the department?',
            validate: input => {
                if(input) {
                    return true;
                } else {
                    console.log('Please enter the department name.');
                    return false;
                }
            }
        })
        .then(department => {
            this.addNewDepartmentQuery(department.name);
        })
    };
    addNewDepartmentQuery(department){
        const sql = `INSERT INTO departments (name)
            VALUES(?)`;
            const params = department;
        
            db.query(sql, params, (err, result) => {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log('Department has been added');
                return this.mainMenu();
            }); 
    }
    viewAllRoles(){
        const sql = `SELECT roles.id, roles.title, roles.salary, departments.name AS department_name FROM roles LEFT JOIN departments ON roles.department_id = departments.id`;

        db.query(sql, (err, result) => {
            if(err) {
                console.log(err);
                return;
            }
            console.table(result);
            return this.mainMenu();
        });
    };
    addNewRolePrompt(){
        let departmentList =[];
        db.promise().query(`SELECT * FROM departments`)
            .then(([rows,fields]) => {
                rows.forEach(department => {
                    departmentList.push(department.name);
                });
                return departmentList;
            })
            .then(departmentChoices => {
                inquirer.prompt([
                    {
                        type: 'input',
                        name: 'title',
                        message: 'What is the title of the role?',
                        validate: input => {
                            if(input) {
                                return true;
                            } else {
                                console.log('Please enter the role title.');
                                return false;
                            }
                        }
                    },
                    {
                        type: 'input',
                        name: 'salary',
                        message: 'What is the salary for this role?',
                        validate: input => {
                            if(input) {
                                return true;
                            } else {
                                console.log('Please enter the salary.');
                                return false;
                            }
                        }
                    },
                    {
                        type: 'list',
                        name: 'department',
                        message: 'What is the department for this role?',
                        choices: departmentChoices
                    }
                ])
                .then(roleData => {
                    // change department name back to department id
                    db.promise().query(`SELECT id FROM departments WHERE name = ?`, roleData.department)
                        .then(([rows,fields]) => {
                            console.log(rows[0].id);
                            return rows[0].id
                        }).then(departmentId => {
                            this.addNewRoleQuery(roleData.title, roleData.salary, departmentId)
                        });
                });
            });
    };
    addNewRoleQuery(title, salary, department){
        const sql = `INSERT INTO roles (title, salary, department_id)
        VALUES(?,?,?)`;
        const params = [title, salary, department];

        db.query(sql, params, (err, result) => {
            if(err) {
                console.log(err);
                return;
            }
            console.log('Role has been added');
            return this.mainMenu();
        });
    };
    viewAllEmployees(){
        const sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, 
        departments.name AS department_name, CONCAT(m.first_name, ' ', m.last_name) AS manager
        FROM employees 
        LEFT JOIN roles ON employees.role_id = roles.id 
        LEFT JOIN departments ON roles.department_id = departments.id
        LEFT JOIN employees m ON m.id = employees.manager_id`;

        db.query(sql, (err, result) => {
            if(err) {
                console.log(err);
                return;
            }
            console.table(result);
            return this.mainMenu();
        });
    };
    addNewEmployeePrompt(){
        let roleList = [];
        let managerList = [];
        db.promise().query(`SELECT title FROM roles`)
            .then(([rows, fields]) => {
                rows.forEach(role => {
                    roleList.push(role.title)
                });
                return roleList;
            }). then(roleChoices => {
                db.promise().query(`SELECT CONCAT(first_name, ' ', last_name) AS name
                    FROM employees
                    WHERE employees.manager_id IS NULL`)
                    .then(([rows, fields]) => {
                        rows.forEach(manager => {
                            managerList.push(manager.name)
                        });
                        return managerList;
                    })
                    .then(managerChoices => {
                        inquirer.prompt([
                            {
                                type: 'input',
                                name: 'firstName',
                                message: "What is the employee's first name?",
                                validate: input => {
                                    if (input){
                                        return true;
                                    } else {
                                        console.log("Please enter the employee's first name.");
                                        return false;
                                    }
                                }
                            },
                            {
                                type: 'input',
                                name: 'lastName',
                                message: "What is the employee's last name?",
                                validate: input => {
                                    if (input){
                                        return true;
                                    } else {
                                        console.log("Please enter the employee's last name.");
                                        return false;
                                    }
                                }
                            },
                            {
                                type: 'list',
                                name: 'role',
                                message: "What is the employee's role",
                                choices: roleChoices
                            },
                            {
                                type: 'list',
                                name: 'manager',
                                message: "Who is the employee's manager?",
                                choices: managerChoices
                            }
                        ])
                        .then(employeeData =>{
                            // convert role name back to id
                            db.promise().query(`SELECT id, title FROM roles WHERE title = ?`, employeeData.role)
                                .then(([rows, fields]) => {
                                    return rows[0].id;
                                })
                                .then(roleId => {
                                    //convert manager name back to id
                                    db.promise().query(`SELECT id, CONCAT(first_name, ' ', last_name) AS manager
                                        FROM employees
                                        WHERE CONCAT(first_name, ' ', last_name) = ?`, employeeData.manager)
                                        .then(([rows, fields]) => {
                                            return rows[0].id;
                                        })
                                        .then(managerId => {
                                            this.addNewEmployeeQuery(employeeData.firstName, employeeData.lastName, roleId, managerId)
                                        });
                                });    
                        });
                    });
                });
    };
    addNewEmployeeQuery(firstName, lastName, roleId, managerId){
        const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
        VALUES(?,?,?,?)`;
        const params = [firstName, lastName, roleId, managerId];

        db.query(sql, params, (err, result) => {
            if(err) {
                console.log(err);
                return;
            }
            console.log('Employee has been added');
            return this.mainMenu();
        });
    };
    updateEmployeeRolePrompt(){
        let employeeList = [];
        let roleList = [];
        db.promise().query(`SELECT title FROM roles`)
            .then(([rows, fields]) => {
                rows.forEach(role => {
                    roleList.push(role.title)
                });
                return roleList;
            })
            .then(roleChoices => {
                db.promise().query(`SELECT CONCAT(first_name, ' ', last_name) AS name
                    FROM employees`)
                    .then(([rows, fields]) => {
                        rows.forEach(employee => {
                            employeeList.push(employee.name)
                        });
                        return employeeList;
                    })
                    .then(employeeChoices => {
                        inquirer.prompt([
                            {
                                type: 'list',
                                name: 'employee',
                                message: "Which employee would you like to update?",
                                choices: employeeChoices
                            },
                            {
                                type: 'list',
                                name: 'role',
                                message: "What is the employee's new role?",
                                choices: roleChoices 
                            }
                        ])
                        .then(updatedRoleData => {
                            db.promise().query(`SELECT id, CONCAT(first_name, ' ', last_name) AS name
                            FROM employees
                            WHERE CONCAT(first_name, ' ', last_name) = ?`, updatedRoleData.employee)
                                .then(([rows, fields]) => {
                                    return rows[0].id;   
                                })
                                    .then(employeeId => {
                                        db.promise().query(`SELECT id, title FROM roles WHERE title =?`, updatedRoleData.role)
                                        .then(([rows, fields]) => {
                                            return rows[0].id;
                                        })
                                            .then(roleId => {
                                                this.updateEmployeeRoleQuery(roleId, employeeId);
                                            });
                                    });
                        });
                    });
            });
    };
    updateEmployeeRoleQuery(role, employee){
        const sql = 'UPDATE employees SET role_id = ? WHERE id = ?';
        const params = [role, employee];

        db.query(sql, params, (err, result) => {
            if(err) {
                console.log(err);
                return;
            }
            console.log('Employee has been updated');
            return this.mainMenu();
        });
    };
};

module.exports = Tracker;