export async function parseCsvFile(file){
  return new Promise((resolve,reject)=>{
    Papa.parse(file,{header:true,dynamicTyping:true,complete:(res)=>resolve(res.data),error:reject});
  });
}