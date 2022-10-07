interface DraggableItemIdParts {
  droppableId: string;
  draggableId: string;
}

export const getDraggableItemIdParts = (id: string): DraggableItemIdParts => {
  const [droppableId, draggableId] = id.split('.');

  return {
    draggableId: draggableId || droppableId,
    droppableId: draggableId ? droppableId : '',
  };
};
