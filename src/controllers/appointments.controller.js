const pool = require("../config/db")

const createNewAppointment = async (req,res) => {
   const {serviceId, start_time, date, userId , duration} = req.body;
   const splitTime = start_time.split(":")
    
   // logic to get appoinment end time
   const x = new Date(`${date}T${start_time}:00`) 
   x.setMinutes(x.getMinutes() + duration)
   const end_time = x.toTimeString().slice(0,5)
   
   const overlappingAppointments = await pool.query("SELECT id FROM appointment WHERE user_id = $1 AND date = $2 AND $3 < end_time AND $4 > start_time", [userId, date, start_time, end_time ])
   console.log(overlappingAppointments)
    
   if(overlappingAppointments.rowCount>0){
    return res.status(409).send({messagge:"Service already booked in thhis time range"})     
   }
   
   const newAppointmen = await pool.query("INSERT INTO appointment (user_id, service_id, date, start_time, end_time, customer_name, customer_email,created_at) VALUES($1,$2,$3,$4,$5,$6, $7, now() )", [userId, serviceId,date,start_time, end_time, "john doe", "john@doe.com"])
   if (newAppointmen.rowCount == 1){
    return res.status(200).send({message:"Appointmen created"})
   }
   //end_time::time + INTERVAL '70 minutes' as x
    //const end_time = start_time + serviceDuration

    console.log(overlappingAppointments.rows.length)
    return res.send({message:"Request received"})


}

module.exports = {createNewAppointment}