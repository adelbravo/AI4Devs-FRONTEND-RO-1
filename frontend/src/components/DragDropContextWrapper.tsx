import React, { useEffect, useState } from 'react';
import { DragDropContext, DragDropContextProps } from 'react-beautiful-dnd';

/**
 * A wrapper component for DragDropContext that handles the React 18 strict mode issue
 * with react-beautiful-dnd. This component ensures that the drag and drop functionality
 * is only enabled after the component has mounted, which avoids issues with the double
 * rendering in React 18 strict mode.
 */
const DragDropContextWrapper: React.FC<DragDropContextProps> = (props) => {
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
    // Don't render anything until the component is enabled
    return <div style={{ minHeight: '200px' }}></div>;
  }

  // Create a wrapper for onDragEnd to handle errors
  const onDragEndWrapper = (result: any, provided: any) => {
    try {
      if (props.onDragEnd) {
        props.onDragEnd(result, provided);
      }
    } catch (error) {
      console.error('Error in onDragEnd:', error);
    }
  };

  return <DragDropContext {...props} onDragEnd={onDragEndWrapper} />;
};

export default DragDropContextWrapper;