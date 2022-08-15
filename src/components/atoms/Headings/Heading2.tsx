type Props = {
  text: string;
};
export default function Heading2(props: Props) {
  const { text } = props;
  return <h2>{text}</h2>;
}
