const bookingDB = require('../modal/booking.modal')

const getBookings= async(req, res)=>{
    // bookingDB.find().then(bookings=>{
    //     console.log(bookings)
    //     if(bookings.length > 0){
    //         res.json({msg: "All bookings fetched successfully", bookings: bookings, status:true})
    //     }else{
    //         res.json({msg: "No bookings found,", bookings: [], status:false})
    //     }
    // }).catch(err=>{
    //     console.log(err, "Cannot fetch bookings");
        
    // })

    try {
        const bookings  = await bookingDB.find()
        
        if(bookings.length > 0){
            res.json({msg: "All bookings fetched successfully", bookings: bookings, status:true})
        }else{
            res.json({msg: "No bookings found,", bookings: [], status:false})
        }    
    } catch (error) {
        
    }
}


const updateDeliver = (req, res)=>{
    bookingDB.findOneAndUpdate(
        {_id:req.body.bkId},
        {$set : {delivered:true}},
        {new: true}
)
        .then(booking=>{
        if(booking){
            res.json({msg: "Booking updated successfully",  status:true})
        }else{
            res.json({msg: "No booking found with this ID", status:false})
        }
    }).catch(err=>{
        
    })
}
module.exports = {getBookings, updateDeliver}