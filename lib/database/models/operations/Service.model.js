import mongoose, { Schema } from 'mongoose';

const ServiceSchema = new Schema({
 image: { type: String, required: false },
  type: { type: String, required: true },
  priority: { type: String, required: true },
  product_id: { type: Number, required: true },
  product_name: { type: String, required: true },
  order_no: { type: Number, required: true },
  client_id: { type: Number, required: true }, 
  amc: { type: String, required: true }, 
  sale_date: { type: Date, required: true },
  client_name: { type: String, required: true },
  service_head: { type: String, required: true },
  service_staff: { type: String, required: true },
  service_receive_data: { type: Date, required: true },
  start_date_time: { type: Date, required: true },
  end_date_time: { type: Date, required: true },
  task_duration: { type: String, required: true }, 
  expense: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.models.Service || mongoose.model('Service', ServiceSchema);
// type   ,  priority  ,  product_id   ,  product_name  ,   order_no   , client_id  ,    amc   ,  sale_date , client_name   ,   service_head  ,  service_staff ,   service_receive_data  ,  start_date_time  ,  end_date_time ,  task_duration   ,   expense  