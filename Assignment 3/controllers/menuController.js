const Menu = require("../models/menuModel");
const APIFeatures = require("../utils/apiFeatures")
const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")
const errorController = require("../controllers/errorController")
const authController = require("../controllers/authController")
exports.TopDeals = (req,res,next)=>{
  req.query.limit ='5';
  req.query.sort = '-rating,price';
  next();

}

exports.wrongroute = catchAsync(async (req, res,next) => {
  return next(new AppError(`Can not find this route ${req.originalUrl} on our database`,404))
});

exports.findAllMenus = catchAsync(async (req, res,next) => {
   console.log(req.query);
   const features = new APIFeatures(Menu.find(),req.query).filter().sort().limitFields().pagination();
   const menus =await features.query;
    
    //const menus = await Menu.find();
    
    
    res.status(200).json({
      status: 'success',
      results: menus.length,
      data: {
        menus
      }
    });
 

 
});

exports.findMenu = catchAsync(async (req, res,next) => {
  var menu;
   console.log("at find menu");
   if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    // it's an ObjectID    
     menu = await Menu.findById(req.params.id);
     if (!menu) {
       const app = new AppError(`Can not find Menu with id ${req.params.id} on our database`, 404);
       app.showerror(req, res);
  }
  else{
    res.status(200).json({
      status: 'success',
      data: {
        menu
      }
    });
  }

  }
 else { 
    
     const app = new AppError(`Can not find Menu with id ${req.params.id} on our database`, 404);
     app.showerror(req, res);

}
  // const menu = await Menu.findById(req.params.id);

   // if (Object.entries(menu).length === 0){
    
    
  
});



exports.createMenu = catchAsync(async(req, res,next) => {
  // try{
    // console.log("I entered in create menu")
    console.log("body",req.body)
  const newMenu = await (Menu.create(req.body));
   if(!newMenu){
     const app = new AppError(`Can not find Menu`, 404);
     app.showerror(req, res)
   }
   else{
  res.status(201).json({
    status: 'success',
    data: {
    tour: newMenu
    }
  });
}
  // }
  // catch(err){
  //   res.status(400).json({
  //     status:"fail",
  //     message:err
  //     // errorController.erorfunction(err,req,res,next);
  //   });
  // }
 
});

exports.updateMenu = catchAsync(async (req, res,next) => {

  var menu;
 // console.log(req.body)
   if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    // it's an ObjectID    
    menu = await Menu.findByIdAndUpdate(req.params.id, req.body,{
      new: true,
      runValidators: true
    });
     if (!menu) {
       const app = new AppError(`Can not find Menu with id ${req.params.id} on our database`, 404);
       app.showerror(req, res);
      }
      else{
        res.status(200).json({
          status: 'success',
          data: {
            menu  
          }        
      })
} 
}
else {
    // nope    

     const app = new AppError(`Can not find Menu with id ${req.params.id} on our database`, 404);
     app.showerror(req, res);

}
   //console.log("in update")
    
  });


  
//added now
exports.getALLMenus = async(req,res,next) =>{
  try {
      console.log(req.query)
      const queryObj = {...req.query};
      // const excludedFields = ['page','sort','limit','fields'];
      // excludedFields.forEach(el => delete queryObj[el]);
      
      const menus = await Menu.find()
      .where ("price").equals(100)
      .where('rating').equals(4.5); 
  res.status(200).json({
      status: 'success',
      result: menus.length,
      data:{
          menus
      }
  })
  }
  catch(err) {
      res.status(404).json({ 
      status : 'fail',
      message : err
   });
  }
}
exports.monthlyPlan = catchAsync(async (req,res,next)=>{
  
    const year = req.params.year * 1;
    
    var plan = await Menu.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match:{
        startDates:{
          $gte:new Date(`${year}-01-01`),
          $lte:new Date(`${year}-12-31`),
        }
      }
    },
    {
      $group:{
      _id:{$month:'$startDates'},
      numTourStarts:{$sum:1},
      tours:{$push:'$name'}
      }
    },
    {
      $addFields:{month:'$_id'}
    },
    {
      $project:{
        _id:0
      }
    },
    {
      $sort:{numTourStarts:-1}
    }
    
    ]);
    console.log(plan)
    if (Object.entries(plan).length === 0){
       const app = new AppError(`MonthlyPlan with ${year} not found on our database`,404)
       app.showerror(req, res);
   // console.log(Object.entries(plan).length === 0)
    }
    res.status(200).json({
    status: 'success',
    data: {plan}
  });

 
})



