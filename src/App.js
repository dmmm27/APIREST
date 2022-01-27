
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import React, {useState, useEffect} from 'react';

function App() {
  
  const baseUrl = "https://localhost:44321/api/Customer";
  const [data, setData] =useState([]);
  const [modalEditar, setModalEditar] = useState(false);
  const [modalInsertar, setModalInsertar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [getSeleccion, setSeleccion] = useState({
    cli_codigo_cliente: '',
    cli_nombre1: '',
    cli_apellido1: '',
    cli_direccion: '',
    cli_telefono1: '',
    cli_identificacion: '',
    cli_fecha_nacimiento: ''
  })
 
const handleChange=e=>{
  const {name, value} = e.target;
  setSeleccion({
    ...getSeleccion,
    [name]:value
  })
  console.log(getSeleccion);
}



  const peticionGet=async()=> {
   await axios.get(baseUrl)
   .then(response=> {
    setData(response.data);
     
   }).catch(error=> {
     console.log(error);
   })
  }


  const peticionPost=async()=> {
   
    delete getSeleccion.cli_codigo_cliente;
    getSeleccion.cli_telefono1 = parseInt( getSeleccion.cli_telefono1);
    await axios.post(baseUrl, getSeleccion)
    .then(response=> {
     setData(data.concat(response.data));
     abrirCerrarModalInsertar();
    }).catch(error=> {
      console.log(error);
    })
   }
 

   const peticionPut=async()=> {
   
    getSeleccion.cli_telefono1 = parseInt( getSeleccion.cli_telefono1);
    await axios.put(baseUrl+"/"+getSeleccion.cli_codigo_cliente, getSeleccion)
    .then(response=> {
     var res = response.data;
     var dataAux= data;
     dataAux.map(t => {
       if (t.cli_codigo_cliente === getSeleccion.cli_codigo_cliente)
       {
        
         t.cli_direccion = res.cli_direccion;
         t.cli_telefono1 = res.cli_telefono1;
       }
      })
      editarCerrarModalInsertar();
    }).catch(error=> {
      console.log(error);
    })
   }


   const peticionDelete=async()=> {
    
  
    await axios.delete(baseUrl+"/"+getSeleccion.cli_codigo_cliente)
    .then(response=> {
      setData(data.filter(t=>t.cli_codigo_cliente !== response.data));
      abrirCerrarModalEliminar();
    }).catch(error=> {
      console.log(error);
    })
   }



const abrirCerrarModalInsertar=()=>{
  setModalInsertar(!modalInsertar);
}

const editarCerrarModalInsertar=()=>{
  setModalEditar(!modalEditar);
}

const abrirCerrarModalEliminar=()=>{
  setModalEliminar(!modalEliminar);
}


const seleccionarCliente=(t, caso) => {
  setSeleccion(t);
  (caso==="Editar")? 
   editarCerrarModalInsertar() : abrirCerrarModalEliminar();
}


useEffect(() => {
  peticionGet();
},[])


  return (
    <div className="App">
      <br />
      <br />
      <button className="btn btn-primary" onClick={()=>abrirCerrarModalInsertar()}>Nuevo Cliente</button>
      <br /> <br />
      <table className='table table-bordered'>
       <thead>
         <tr>
           <th>ID</th>
           <th>Nombre</th>
           <th>Apellido</th>
           <th>Direccion</th>
           <th>Telefono</th>
           <th>No. Identificación</th>
           <th>Fecha Nacimiento</th>
         </tr>
       </thead>
       <tbody>
       {data.map(t=>  (
         <tr key={t.cli_codigo_cliente}>
          <td>{t.cli_codigo_cliente}</td>
          <td>{t.cli_nombre1}</td>
          <td>{t.cli_apellido1}</td>
          <td>{t.cli_direccion}</td>
          <td>{t.cli_telefono1}</td>
          <td>{t.cli_identificacion}</td>
          <td>{t.cli_fecha_nacimiento}</td>
          <td>
            <button className="btn btn-primary" onClick={()=>seleccionarCliente(t, "Editar")}>Editar</button> { " " }
            <button className="btn btn-danger" onClick={()=>seleccionarCliente(t, "Eliminar")}>Borrar</button>
          </td>
         </tr>
        
       ))}
       </tbody>
      </table>



      <Modal isOpen={modalInsertar}>
        <ModalHeader>Nuevo Ingreso Cliente</ModalHeader>
          <ModalBody>
            <div className="form-group">
           
              <label>Nombre:</label>
              <br />
               <input type="text" className="form-control" name="cli_nombre1"  onChange={handleChange}/>
               <br />
               <label>Apellido:</label>
               <br />
              <input type="text" className="form-control" name="cli_apellido1" onChange={handleChange} />
              <br />
               <label>Dirección:</label>
               <br />
               <input type="text" className="form-control"  name="cli_direccion" onChange={handleChange} />
               <br />
               <label>Telefono:</label>
               <br />
               <input type="text" className="form-control" name="cli_telefono1" onChange={handleChange}/>
               <br />
               <label>No. Identificación:</label>
               <br />
               <input type="text" className="form-control" name="cli_identificacion" onChange={handleChange}/>
               <br />
               <label>Fecha nacimiento:</label>
               <br />
               <input type="text" className="form-control" name="cli_fecha_nacimiento" onChange={handleChange} />
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-primary" onClick={()=>peticionPost()}>Ingresar</button> {" "}
            <button className="btn btn-danger" onClick={()=>abrirCerrarModalInsertar()}>Cancelar</button>
          </ModalFooter>
        
      </Modal>



      <Modal isOpen={modalEditar}>
        <ModalHeader>Editar  Cliente</ModalHeader>
          <ModalBody>
            <div className="form-group">
            <label>ID:</label>
              <br />
               <input type="text" className="form-control"  readOnly value={getSeleccion && getSeleccion.cli_codigo_cliente }/>
               <br />
              <label>Nombre:</label>
              <br />
               <input type="text" className="form-control" readOnly  onChange={handleChange} value={getSeleccion && getSeleccion.cli_nombre1 }/>
               <br />
               <label>Apellido:</label>
               <br />
              <input type="text" className="form-control" readOnly  onChange={handleChange} value={getSeleccion && getSeleccion.cli_apellido1 } />
              <br />
               <label>Dirección:</label>
               <br />
               <input type="text" className="form-control" name="cli_direccion"  onChange={handleChange} value={getSeleccion && getSeleccion.cli_direccion }/>
               <br />
               <label>Telefono:</label>
               <br />
               <input type="text" className="form-control" name="cli_telefono1" onChange={handleChange} value={getSeleccion && getSeleccion.cli_telefono1 } />
               <br />
               <label>No. Identificación:</label>
               <br />
               <input type="text" className="form-control" readOnly onChange={handleChange} value={getSeleccion && getSeleccion.cli_identificacion }/>
               <br />
               <label>Fecha nacimiento:</label>
               <br />
               <input type="text" className="form-control" readOnly onChange={handleChange} value={getSeleccion && getSeleccion.cli_fecha_nacimiento}/>
            </div>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-primary" onClick={()=>peticionPut()}>Editar</button> {" "}
            <button className="btn btn-danger" onClick={()=>editarCerrarModalInsertar()}>Cancelar</button>
          </ModalFooter>
        
      </Modal>

<Modal isOpen={modalEliminar}>
  <ModalBody>
   Seguro de borrar? Cliente ID: {getSeleccion.cli_codigo_cliente}
  </ModalBody>
  <ModalFooter>
   <button className="btn btn-danger" onClick={()=>peticionDelete()}>Sí</button>
   <button className="btn btn-primary" onClick={()=>abrirCerrarModalEliminar()}>No</button>
  </ModalFooter>
</Modal>


    </div>
  );
}



export default App;
