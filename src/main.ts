import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.min.css";
import "./style.css";

document.addEventListener("DOMContentLoaded", () => {
  const grid = GridStack.init({ float: true, resizable: true });

  // Thêm các widget vào lưới với button và input bên trong mỗi thẻ div
  grid.addWidget({
    w: 1,
    h: 1,
    content: `
      <div class='grid-item' id='item1'>
        Item 1
        <button class="resizable">Button 1</button>
        <input class="resizable" type="text" placeholder="Input 1">
      </div>
    `,
  });
  grid.addWidget({
    w: 1,
    h: 1,
    content: `
      <div class='grid-item'>
        Item 2
        <button class="resizable">Button 2</button>
        <input class="resizable" type="text" placeholder="Input 2">
      </div>
    `,
  });
  grid.addWidget({
    w: 1,
    h: 1,
    content: `
      <div class='grid-item'>
        Item 3
        <button class="resizable">Button 3</button>
        <input class="resizable" type="text" placeholder="Input 3">
      </div>
    `,
  });
  grid.addWidget({
    w: 1,
    h: 1,
    content: `
      <div class='grid-item'>
        Item 4
        <button class="resizable">Button 4</button>
        <input class="resizable" type="text" placeholder="Input 4">
      </div>
    `,
  });

  // Hàm để lấy thông tin vị trí, kích thước, loại thẻ HTML và màu sắc của các widget và in ra JSON
  const printJson = () => {
    const items = grid.engine.nodes.map((node) => {
      const element = node.el?.querySelector(".grid-item");
      const tagName = element?.tagName.toLowerCase();
      const backgroundColor = window.getComputedStyle(element!).backgroundColor;
      return {
        x: node.x,
        y: node.y,
        width: node.w,
        height: node.h,
        tagName: tagName,
        backgroundColor: backgroundColor,
      };
    });
    console.log(JSON.stringify(items, null, 2));
  };

  // Hàm để lấy thông tin chi tiết của một widget cụ thể và các phần tử con bên trong
  const getItemDetails = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const rect = element.getBoundingClientRect();
      const tagName = element.tagName.toLowerCase();
      const backgroundColor = window.getComputedStyle(element).backgroundColor;

      // Tạo object chứa thông tin chi tiết của thẻ cha
      const itemDetails = {
        id: id,
        width: rect.width,
        height: rect.height,
        top: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
        tagName: tagName,
        backgroundColor: backgroundColor,
        children: [] as any[], // Mảng chứa thông tin các thẻ con
      };

      // Lấy thông tin chi tiết của các phần tử con
      const children = element.querySelectorAll(".resizable");
      children.forEach((child) => {
        const childRect = child.getBoundingClientRect();
        const childTagName = child.tagName.toLowerCase();
        const childBackgroundColor =
          window.getComputedStyle(child).backgroundColor;

        // Tính toán vị trí của thẻ con dựa trên thẻ cha
        const childTop = childRect.top - rect.top;
        const childBottom = childRect.bottom - rect.top;
        const childLeft = childRect.left - rect.left;
        const childRight = childRect.right - rect.left;

        // Thêm thông tin của thẻ con vào mảng children
        itemDetails.children.push({
          tagName: childTagName,
          width: childRect.width,
          height: childRect.height,
          top: childTop,
          bottom: childBottom,
          left: childLeft,
          right: childRight,
          backgroundColor: childBackgroundColor,
        });
      });

      // In object dưới dạng JSON
      console.log(JSON.stringify(itemDetails, null, 2));
    } else {
      console.log(`Element with id ${id} not found.`);
    }
  };

  // Thêm sự kiện click cho nút
  document.getElementById("print-json")?.addEventListener("click", printJson);
  document
    .getElementById("get-item-details")
    ?.addEventListener("click", () => getItemDetails("item1"));
});
