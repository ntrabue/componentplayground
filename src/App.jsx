import React from "react";
import "./styles.css";
import "./menu/menu.css";
import "./accordion/accordion.css";
import { Menu, MenuButton, MenuList, MenuListItem } from "./menu";
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel
} from "./accordion";

export default function App() {
  return (
    <>
      <MenuDemo />
      <AccordionDemo />
    </>
  );
}

const MenuDemo = () => {
  return (
    <>
      <h2>Menu Demo</h2>
      <Menu>
        <MenuButton as="button">Test</MenuButton>
        <MenuList>
          <MenuListItem onClick={() => alert("option1")} disabled>
            Option 1
          </MenuListItem>
          <MenuListItem onClick={() => alert("option2")}>Option 2</MenuListItem>
          <MenuListItem onClick={() => alert("option3")} disabled>
            Option 3
          </MenuListItem>
          <MenuListItem onClick={() => alert("option4")}>Option 4</MenuListItem>
          <MenuListItem onClick={() => alert("option5")}>Option 5</MenuListItem>
        </MenuList>
      </Menu>
    </>
  );
};

const AccordionDemo = () => {
  return (
    <>
      <h2>Accordion Demo</h2>
      <Accordion>
        <AccordionItem>
          <AccordionHeader>Option 1</AccordionHeader>
          <AccordionPanel>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Senectus
            et netus et malesuada fames ac turpis egestas. Sapien nec sagittis
            aliquam malesuada bibendum arcu vitae elementum curabitur. Tincidunt
            praesent semper feugiat nibh sed pulvinar. Aenean sed adipiscing
            diam donec adipiscing tristique risus nec feugiat. Urna condimentum
            mattis pellentesque id nibh. Leo urna molestie at elementum eu.
            Convallis tellus id interdum velit laoreet. Mattis nunc sed blandit
            libero volutpat sed cras. Ac placerat vestibulum lectus mauris
            ultrices eros in cursus turpis. Nullam non nisi est sit amet
            facilisis magna. Diam donec adipiscing tristique risus nec. Sed
            faucibus turpis in eu mi bibendum.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionHeader>Option 2</AccordionHeader>
          <AccordionPanel>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ligula
            ullamcorper malesuada proin libero nunc. Bibendum ut tristique et
            egestas quis ipsum suspendisse ultrices. Leo vel fringilla est
            ullamcorper eget nulla. Fames ac turpis egestas maecenas pharetra.
            Et molestie ac feugiat sed. Vivamus arcu felis bibendum ut. Nullam
            eget felis eget nunc lobortis mattis. In mollis nunc sed id semper
            risus in hendrerit gravida. Interdum consectetur libero id faucibus
            nisl. Pretium viverra suspendisse potenti nullam. Adipiscing commodo
            elit at imperdiet. Tellus elementum sagittis vitae et leo duis ut
            diam.
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionHeader>Option 3</AccordionHeader>
          <AccordionPanel>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Mi quis
            hendrerit dolor magna eget est lorem ipsum dolor. Tellus cras
            adipiscing enim eu. Sed felis eget velit aliquet sagittis id
            consectetur purus. Morbi tempus iaculis urna id. Tellus molestie
            nunc non blandit massa enim. Fringilla urna porttitor rhoncus dolor
            purus non. Arcu dictum varius duis at consectetur lorem donec. At
            volutpat diam ut venenatis tellus in metus vulputate eu. Quis
            viverra nibh cras pulvinar mattis nunc sed. Nisi quis eleifend quam
            adipiscing. Augue eget arcu dictum varius duis at consectetur lorem
            donec. Adipiscing elit duis tristique sollicitudin nibh sit amet
            commodo. Sit amet luctus venenatis lectus magna fringilla.
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  );
};
