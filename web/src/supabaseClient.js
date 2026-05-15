import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://mknlggkvfzajiddosalb.supabase.co'
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rbmxnZ2t2ZnphamlkZG9zYWxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMjAwMTgsImV4cCI6MjA5Mzc5NjAxOH0.cm_fLEUHuuq27h6_ZRCXD5G6bnCmRt_i0XYwGVF3sUg'

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
