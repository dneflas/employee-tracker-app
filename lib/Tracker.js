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
        // create a switch case for each activity
        ]).then(selectedTask => {
            switch(selectedTask.task){
                case 'View all departments':
                    console.log('view all departments');
                    break;
                case 'View all roles':
                    console.log('view all roles');
                    break;
                case 'View all employees':
                    console.log('view all employees');
                    break;
                case 'Add a department':
                    console.log('add a department');
                    break;
                case 'Add a role':
                    console.log('add a role');
                    break;
                case 'Add an employee':
                    console.log('add employee');
                    break;
                case 'Update an employee role':
                    console.log('update employee');
                    break;
                default:
                    console.log('Goodbye!')
                    break;
            }
        });
    
    };
    viewAllDepartments(){};
    addNewDepartment(){};
    viewAllRoles(){};
    addNewRole(){};
    viewAllEmployees(){};
    addNewEmployee(){};
    updateEmployee(){};
    getDepartments(){};
    getRoles(){};
    getManagers(){};
    getEmployees(){};
}

module.exports = Tracker;