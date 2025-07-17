import React, { useEffect, useState } from 'react';
import { DragDropContext as LibDragDropContext } from 'react-beautiful-dnd';

// This is a wrapper component to fix the React 18 strict mode issue with react-beautiful-dnd
// See: https://github.com/atlassian/react-beautiful-dnd/issues/2399
const DragDropContext = ({ children, ...props }: any) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // This is a workaround for the issue with react-beautiful-dnd and React 18
    // The issue is that react-beautiful-dnd doesn't work with React.StrictMode in React 18
    // This workaround enables the drag and drop functionality after the component has mounted
    const animation = requestAnimationFrame(() => setEnabled(true));
    
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    // Render children without drag and drop functionality
    return <>{children}</>;
  }

  return <LibDragDropContext {...props}>{children}</LibDragDropContext>;
};

export default DragDropContext;