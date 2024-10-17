const paystack = require('paystack-api')(process.env.PAYSTACK_SECRETKEY);

const bookingDB = require('../modal/booking.modal')
const booking= async(req, res)=>{
    console.log(req.body)
    let response;
    if(req.body.paymentType == true) {
        response = await paystack.transaction.initialize({
            email: req.body.email,
            amount: req.body.amount * 100, // Paystack accepts amounts in kobo (Naira's subunit)
            callback_url: 'http://localhost:5173/home', // Replace with your callback URL
          });
    }
      

    const newBooking = new bookingDB({...req.body, status: 'success', ref: req.body.paymentType == true ? response.data.reference : ''});
    
    // bookingDB.findOne(email).then((booked)=>{
    //     if(booked.delivered==false){
    //         alert("You have one booking and not yet deliver wait patientle")
    //     }else{
            
    //     }
    // })
    newBooking.save().then(result=>{
        if(result){
            res.status(201).json({
                msg: "Coffee booked successfully", 
                booking: result, status:true, 
                authorization_url: req.body.paymentType == true ? response.data.authorization_url : null,
            })
        }
    }).catch(err=>{
        console.log(err, "Cannot book coffee");
        
    })
}

const getBookings=(req, res)=>{
    bookingDB.find({email:req.body.email}).then(bookings=>{
        if(bookings.length > 0){
            res.json({msg: "All bookings fetched successfully", bookings: bookings, status:true})
        }else{
            res.json({msg: "No bookings found,", bookings: [], status:false})
        }
    }).catch(err=>{
        console.log(err, "Cannot fetch bookings");
        
    })
}

const deleteBooking = (req, res)=>{    
    bookingDB.findOneAndDelete({_id: req.query.id}).then(booking=>{
        if(booking){
            res.json({msg: "Booking deleted successfully", booking: booking, status:true})
        }else{
            res.json({msg: "Booking not found", booking, status:false})
        }
    }).catch(err=>{
        console.log(err, "Cannot delete booking");
        
    })
}
module.exports = {booking, getBookings, deleteBooking}