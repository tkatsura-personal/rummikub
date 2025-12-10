
import React from "react";

// Firebase imports

const defaultTile = {
  width: 80,
  height: 100,
  x: 200,
  y: 200
};

type TileProps = {
  width: number;
  height: number;
  x: number;
  y: number;
  selected: boolean;
};

class Tile extends React.Component<
  TileProps & { onPointerDown: (e: React.PointerEvent) => void }
> {
  state = { pressed: false };

  handlePointerDown = (e: React.PointerEvent) => {
    this.setState({ pressed: true });
    this.props.onPointerDown(e);
  };

  handlePointerUp = () => {
    this.setState({ pressed: false });
  };

  componentDidMount() {
    document.addEventListener("pointerup", this.handlePointerUp);
  }

  componentWillUnmount() {
    document.removeEventListener("pointerup", this.handlePointerUp);
  }

  render() {
    const { width, height, x, y, selected } = this.props;
    const { pressed } = this.state;
    return (
      <div
        className={"tile"}
        style={{
          width,
          height,
          left: x,
          top: y,
          border: selected ? "2px solid red" : "none",
          boxShadow: pressed ? "0 0 10px #333" : "none"
        }}
        onPointerDown={this.handlePointerDown}
      ></div>
    );
  }
}

function game() {
  const [tileSelected, setTileSelected] = React.useState(false)
  const [tile, setTile] = React.useState(defaultTile);
  const [pointer, setPointer] = React.useState<[number, number]>();

  const handleMousePress = (e) => {
    setTileSelected((b) => !b);
    const x = e.pageX - tile.x;
    const y = e.pageY - tile.y;
    setPointer([x, y]);
  };

  const handleMouseTrack = (e) => {
    const x = e.pageX;
    const y = e.pageY;
    setPointer([x, y]);
    //console.log("Pointer move:", x, y);
  }

  const handleMouseRelease = (e) => {
    if (tileSelected) {
      //Check the current tile position after the mouse is released
      console.log("check if pointer is within the page bounds");
      const rect = document.documentElement.getBoundingClientRect();
      console.log("Page bounds:", rect);
      console.log("Tile position:", tile);
      if (tile.x < rect.left || tile.x + tile.width > rect.right ||
          tile.y < rect.top || tile.y + tile.height > rect.bottom) {
        console.warn("Tile out of bounds, resetting position");
        //Snap to closest point inside the border
        setTile({
          ...tile, 
          x: Math.min(Math.max(tile.x, rect.left + 50), rect.right - (tile.width + 50)), 
          y: Math.min(Math.max(tile.y, rect.top + 50), rect.bottom - (tile.height + 50)) 
        });
      }
      setTileSelected(false);
    }
  }
  

  React.useEffect(() => {
    document.addEventListener("pointermove", handleMouseTrack)
    document.addEventListener("pointerup", handleMouseRelease)
    return () => {
      document.removeEventListener("pointermove", handleMouseTrack)
      document.removeEventListener("pointerup", handleMouseRelease)
    };
  }, [tileSelected]);

  React.useEffect(() => {
    if (pointer && tileSelected) {
      // Update tile position based on pointer
      //console.log("Updating tile position:", pointer);
      const [x, y] = pointer;
      setTile((t) => ({ ...t, x, y }));
    }
  }, [pointer, tileSelected]);

  return (
    <>
      <div>
        { <Tile {...tile} onPointerDown={handleMousePress} selected={tileSelected} /> }
      </div>
    </>
  )

}

export default game;