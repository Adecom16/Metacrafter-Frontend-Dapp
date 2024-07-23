import { Flex } from "@radix-ui/themes";


export default function Header() {
  return (
    <div className="flex justify-between items-center p-3">
      <div className="p-5"><h1>VESTING</h1></div>
      <Flex gap={"4"} align={"center"}>
        <w3m-button />
      </Flex>
    </div>
  );
}
