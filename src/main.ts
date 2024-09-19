import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.min.css";
import "./style.css";

document.addEventListener("DOMContentLoaded", () => {
  const grid = GridStack.init({ float: true, resizable: true });

  // Xử lý kéo thả từ sidebar vào lưới GridStack
  const draggableItems = document.querySelectorAll(".draggable-item");
  draggableItems.forEach((item) => {
    item.setAttribute("draggable", "true");
    item.addEventListener("dragstart", (event) => {
      event.dataTransfer?.setData(
        "text/plain",
        (event.target as HTMLElement).innerHTML
      );
    });
  });

  const gridElement = document.querySelector(".grid-stack");
  gridElement?.addEventListener("dragover", (event) => {
    event.preventDefault();
  });

  gridElement?.addEventListener("drop", (event) => {
    event.preventDefault();
    const data = event.dataTransfer?.getData("text/plain");
    if (data) {
      const id = `item${grid.engine.nodes.length + 1}`;
      grid.addWidget({
        w: 1,
        h: 1,
        content: `
          <div class='grid-item' id='${id}'>
            ${data}
            <button class="resizable">Button</button>
            <input class="resizable" type="text" placeholder="Input">
          </div>
        `,
      });
    }
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

  // Hàm để lấy thông tin chi tiết của tất cả các widget có cùng tên và các phần tử con bên trong
  const getItemDetails = (name: string) => {
    const elements = Array.from(document.querySelectorAll(".grid-item")).filter(
      (element) => element.textContent?.includes(name)
    );
    const itemsDetails = elements.map((element) => {
      const rect = element.getBoundingClientRect();
      const tagName = element.tagName.toLowerCase();
      const backgroundColor = window.getComputedStyle(element).backgroundColor;

      // Tạo object chứa thông tin chi tiết của thẻ cha
      const itemDetails = {
        id: element.id,
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

      return itemDetails;
    });

    // In object dưới dạng JSON
    console.log(JSON.stringify(itemsDetails, null, 2));
  };

  // Thêm sự kiện click cho nút
  document.getElementById("print-json")?.addEventListener("click", printJson);
  document
    .getElementById("get-item-details")
    ?.addEventListener("click", () => getItemDetails("Item 1"));
});
