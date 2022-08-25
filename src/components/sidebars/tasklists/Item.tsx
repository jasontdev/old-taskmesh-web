import { useNavigate } from "react-router-dom";
import { Box, Highlight, Text } from "@chakra-ui/react";

type Props = {
  id: number;
  value: string;
  onItemClick: (key: number) => void;
  isSelected: boolean;
};

export default function (props: Props) {
  const { id, value, onItemClick, isSelected } = props;
  const navigate = useNavigate();

  function handleClick() {
    onItemClick(id);
    navigate(`/tasklist/${id}`);
  }

  return isSelected ? (
    <Box key={id} marginLeft="-0.5rem">
      <Text fontSize="lg">
        <Highlight
          query={value}
          styles={{ bg: "dodgerblue", color: "white", px: "0.5rem" }}
        >
          {value}
        </Highlight>
      </Text>
    </Box>
  ) : (
    <Box key={id} onClick={handleClick}>
      <Text fontSize="lg">{value}</Text>
    </Box>
  );
}
