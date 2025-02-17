import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Box, Paper, Typography, TextField } from "@mui/material";
import { styled } from "@mui/system";
import { FaSearch } from "react-icons/fa";
import { MdDragIndicator } from "react-icons/md";
import axios from "axios";

const listContainer = {
  padding: "16px",
  margin: "8px",
  minHeight: "300px",
  backgroundColor: "#f5f5f5",
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: "8px"
}

// styled de mui dice estar deprecado, pero es necesario en este caso para que el drag and drop funcione.
const DraggableItem = styled(Paper)(({ isdragging }) => ({
  padding: "12px",
  margin: "4px 0",
  display: "flex",
  alignItems: "center",
  backgroundColor: isdragging ? "#e3f2fd" : "#ffffff",
  transition: "background-color 0.2s ease",
  "&:hover": {
    backgroundColor: "#f5f5f5"
  }
}));

const route = import.meta.env.VITE_API_ROUTE;

const DragAndDrop = ({ handleServices, servicesSelected, step }) => {
  const [sourceItems, setSourceItems] = useState([]);
  const [destItems, setDestItems] = useState([]);
  const [sourceSearch, setSourceSearch] = useState("");
  const [destSearch, setDestSearch] = useState("");

  // Trae los servicios medicos solo cuando el paso es 2
  useEffect(() => {
    if(step !== 2) return
    axios
        .get(`${route}/servicio_medico/traer`)
        .then(response => {
          let items = response.data

          // Filtra los servicios que ya estan seleccionados
          items = items.filter(item => !servicesSelected.find(service => service.codigo_servicio === item.codigo_servicio))
          setSourceItems(items)
          setDestItems(servicesSelected)
        })
  }, [step])

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sourceId = result.source.droppableId;
    const destId = result.destination.droppableId;

    if (sourceId === destId) {
      const items = sourceId === "source" ? [...sourceItems] : [...destItems];
      const [removed] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, removed);
      
      if (sourceId === "source") {
        setSourceItems(items);
      } else {
        setDestItems(items);
      }
    } else {
      const sourceList = sourceId === "source" ? [...sourceItems] : [...destItems];
      const destList = destId === "source" ? [...sourceItems] : [...destItems];
      
      const [removed] = sourceList.splice(result.source.index, 1);
      destList.splice(result.destination.index, 0, removed);

      if (sourceId === "source") {
        setSourceItems(sourceList);
        setDestItems(destList);
        handleServices(destList) // Envia los servicios a la lista
      } else {
        setDestItems(sourceList);
        setSourceItems(destList);
        handleServices(sourceList) // Actualiza la lista 
      }
     
    }
  };

  const filterItems = (items, searchTerm) => {
    return items.filter((item) =>
      item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const renderList = (items, droppableId, searchTerm, setSearchTerm, title) => (
    <Paper elevation={2} sx={listContainer}>
      <Typography variant="h6" gutterBottom>
        {title} ({items.length})
      </Typography>
      <TextField
        sx={{  marginBottom: "16px" }}
        size="small"
        fullWidth
        placeholder="Buscar servicios"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        slotProps={{
          input: {
            startAdornment: <FaSearch style={{ marginRight: 8 }} />
          }
        }}
      />
      <Droppable droppableId={droppableId}>
        {(provided, snapshot) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              minHeight: 200,
              minWidth: 400,
              backgroundColor: snapshot.isDraggingOver ? "#e3f2fd" : "transparent",
              transition: "background-color 0.2s ease"
            }}
          >
            {filterItems(items, searchTerm).map((item, index) => (
              <Draggable key={item.codigo_servicio} draggableId={item.codigo_servicio} index={index}>
                {(provided, snapshot) => (
                  <DraggableItem
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    isdragging={snapshot.isdragging}
                    elevation={snapshot.isdragging ? 3 : 1}
                  >
                    <Box {...provided.dragHandleProps} sx={{ mr: 2 }}>
                      <MdDragIndicator />
                    </Box>
                    <Typography>{item.nombre}</Typography>
                  </DraggableItem>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </Paper>
  );

  return (
    <Box sx={{ p: 3, maxWidth: 1200 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h4" color="green" mb={4}>Servicios</Typography>
      </Box>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2
          }}
        >
          {renderList(
            sourceItems,
            "source",
            sourceSearch,
            setSourceSearch,
            "Servicios disponibles"
          )}
          {renderList(
            destItems,
            "destination",
            destSearch,
            setDestSearch,
            "Servicios prestados"
          )}
        </Box>
      </DragDropContext>
    </Box>
  );
};

export default DragAndDrop;