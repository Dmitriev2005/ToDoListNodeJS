import { Sequelize, DataTypes } from "sequelize"


const db = new Sequelize("to_do_list","root","",{
  dialect:"mysql",
  host:"localhost",
  define:{
    freezeTableName:true
  }
})
const UserTable = db.define("user",{
  id_user:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
  },
  lastname_user:{
    type:DataTypes.STRING
  },
  name_user:{
    type:DataTypes.STRING
  },
  surname_user:{
    type:DataTypes.STRING
  },
  login:{
    type:DataTypes.STRING
  },
  password:{
    type:DataTypes.STRING
  }
}, {timestamps:false})
const TaskTable = db.define("task",{
    id_task:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    title_task:{
        type:DataTypes.STRING
    },
    describe_task:{
        type:DataTypes.STRING
    },
    data_add_task:{
        type:DataTypes.DATE
    },
    data_completion_task:{
        type:DataTypes.DATE
    },
    user_fk_id_task :{
        type:DataTypes.INTEGER,
        references:{
          model:'user',
          key:'id_user'
        }
    }
},{timestamps:false})
TaskTable.associations = (model) =>{
  TaskTable.belongsTo(model.User,{
    foreignKey:'user_fk_id_task',
    onDelete:'CASCADE'
  })
}
export {UserTable,TaskTable}
