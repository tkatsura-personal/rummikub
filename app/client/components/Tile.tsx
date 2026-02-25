type TileProps = {
  number: number
  color: string
}

function Tile({ number, color }: TileProps) {
  return (
    <div style={{ color }}>
      {number}
    </div>
  )
}

export default Tile;