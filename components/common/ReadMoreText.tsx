import React, { useState } from 'react';
import { Text, Pressable, TextStyle, StyleProp } from 'react-native';

interface ReadMoreTextProps {
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
  readMoreStyle?: StyleProp<TextStyle>;
  children: React.ReactNode;
}

const ReadMoreText: React.FC<ReadMoreTextProps> = ({ 
  children, 
  numberOfLines = 3, 
  style, 
  readMoreStyle 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const handleTextLayout = (event: any) => {
    const { lines } = event.nativeEvent;
    setShowReadMore(lines.length > numberOfLines);
  };

  return (
    <Pressable onPress={showReadMore ? toggleReadMore : undefined}>
      <Text 
        style={style} 
        numberOfLines={isExpanded ? undefined : numberOfLines}
        onTextLayout={handleTextLayout}
      >
        {children}
      </Text>
      {showReadMore && (
        <Text style={[{ color: 'lightgray' }, readMoreStyle, style]}>
          {isExpanded ? 'Read Less' : 'Read More'}
        </Text>
      )}
    </Pressable>
  );
};

export default ReadMoreText;