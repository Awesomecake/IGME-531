/* BASED ON TUTORIAL + CODE FROM
https://robertheaton.com/2018/12/17/wavefunction-collapse-algorithm/
https://github.com/robert/wavefunction-collapse

Dissected the code and recreate a simpler implementation that I can use to help understand how it works plus as a way to possibly teach it in the future.

Original Source to what started Wave Function Collapse
https://github.com/mxgmn/WaveFunctionCollapse
https://github.com/math-fehr/fast-wfc

/* ===============================================
IMPROVEMENTS NOTES
- The Tile Matrix as a Flat Array, faster to iterate then Array of Arrays.
- Instead of saving Tiles array per cell, Use a BitSet with Tile Indexes
- Replace Random gen with Seeded One, Hopefully to regenerate same results over&over
=================================================*/


// The way the algorithm works is based on Constraints, which is really just RULES.
// The rules are pretty simple : C can have L on its left side, C can have L on its Up Side, etc.
// Writing the rules manually can lead to mistakes, so its better to find ways to auto generate them
// In this example, I learned about using a multi dimensional array with tiles layed out in some fashion.
// We can then generate rules based on the placement of the tiles, easy to check what each tile is next to, 
// then we can create rules that way.
function parse_matrix_rules( m ){
	let ylen		= m.length,		// Height of the Matrix
		xlen		= m[0].length,	// Width of the Matrix
		x_max		= xlen - 1,		// Boundary on X
		y_max 		= ylen - 1, 	// Boundary on Y
		len 		= xlen * ylen,	// Total cells
		tiles		= {},			// List of Tile Weights
		tile_ary	= [],			// Array of tile names
		r_keys 	= {},				// Rules in simple key format.
		tile, y, x;					

	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// LOCAL FUNCTIONS
	// Rule sets, save as unique.
	let add_rule = ( a, b, dir )=>{
		let key = a + "_" + b + "_" + dir;
		if( !r_keys[ key ] ) r_keys[ key ] = true;
	};

	// Save tile name & accordance, This is the WEIGHT value for WFC.
	let add_tile = ( a )=>{
		if( tiles[ a ] )	tiles[ a ]++;
		else{
			tiles[ a ] = 1;
			tile_ary.push( a );
		}
	}

	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// Go through every cell, and check what Tile is next to what tile.
	// be it in the following directions, UP, Down, Left, Right.
	for( let i=0; i < len; i++ ){
		y		= Math.floor( i / xlen );		// Cell to inspect
		x		= ( i % xlen );
		tile 	= m[y][x];
		
		add_tile( tile );

		if( x > 0 )		add_rule( tile,  m[y][x-1], "LEFT" );		
		if( x < x_max )	add_rule( tile,  m[y][x+1], "RIGHT" );
		if( y > 0 )		add_rule( tile,  m[y-1][x], "UP" );
		if( y < y_max )	add_rule( tile,  m[y+1][x], "DOWN" );
	}

	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~-
	return { tiles, rules:r_keys, tile_ary };
}

// Create a Matrix where each cell contains all possible tiles
// The idea is we start with all possibilites then we start to 
// widdle away tiles that dont fit with their neighbors.
function gen_cell_matrix( list=[] ){
	let r, row, cells = new Array( HEIGHT );
	for( let i=0; i < HEIGHT; i++ ){						// Create Rows
		row = new Array( WIDTH );
		for( r=0; r < WIDTH; r++ ) row[ r ] = [...list];	// Columns with tile List.
		cells[ i ] = row;
	}
	return cells;
}

// Check if we are all done successful. 
// Requires every cell to only have 1 tile left, no more, no less.
// I do not check for or Handle failure, WFC can lead to cells having
// NO tiles. It happens for time to time, normally just reset and try
// again at a new starting tile.
function is_all_collapsed( cells ){
	let x,y;
	for( y=0; y < cells.length; y++ ){
		for( x=0; x < cells[y].length; x++ ){
			if( cells[y][x].length > 1 ) return false;
		}
	}
	return true;
}

// Find the Cell with the least Probability Score
// Which Kinda means which cell has the least available tiles with the least total weight
// The main goal is that, the cells with the least score, has less choices and better chances
// of collapsing quickly without error.
function find_entropy_cell( cells, tiles ){
	let x, y, c, entropy, entropy_rnd,
		min		= Infinity,
		min_x	= 0,
		min_y	= 0;

	for( y=0; y < cells.length; y++ ){
		for( x=0; x < cells[y].length; x++ ){
			
			c = cells[y][x];
			if( c.length == 1 ) continue;	// Skip and Cells that have been collapsed.

			entropy		= shannon_entropy( c, tiles );			// Calc some Probabiity Value based on the Tile Weights available.
			entropy_rnd	= entropy - ( Math.random() * 0.001 );	// Most cells will have the same Prob if no attempt to collapse, 
																// so a bit of random lets us pick a "Random" cell within the
																// the cells with the least probability score when all is equal.
			if( entropy_rnd < min ){	// Found a possible cell that has the least probability.
				min		= entropy_rnd;
				min_x	= x;
				min_y	= y;
			}
		}
	}

	return [ min_x, min_y ];
}

// https://en.wiktionary.org/wiki/Shannon_entropy
// Calculate some kind of probability based on a curve, I guess by what I've read.
function shannon_entropy( cell, tiles ){
	let c, weight,
		total_weight		= 0,
		total_log_weight	= 0;

	for( c of cell ){
		weight				= tiles[ c ];
		total_weight		+= weight;
		total_log_weight	+= weight * Math.log( weight );
	}

	return Math.log( total_weight ) - ( total_log_weight / total_weight );
}

// Grab a cell, then out of the available tiles in it, pick one
// randomly based on the weight of the cell.
function collapse_cell( pos, cells, tiles ){
	let w, rnd_weight, 
		cell		= cells[ pos[1] ][ pos[0] ],		// Get Tiles array for the cell.
		t_weight	= 0, 
		weights		= new Array();

	// Create list of weights, plus compute total weight.
	// We use the total weight as a way to randomly pix a
	// tile as the only tile this cell will have.
	for( let c of cell ){
		w			= tiles[ c ];
		t_weight	+= w;
		weights.push( w );
	}

	// Apply a Random Number to the total Weight,
	// This will generate a number smaller then total weight.
	rnd_weight = Math.random() * t_weight; 

	// Loop through all the available tile weights for this cell
	for( let i=0; i < weights.length; i++ ){

		// Since Random total Weight is less then Total, this makes sure
		// that at some point it'll be in the negative when we keep subtracting
		// weight before we run out of weights for the process.
		// Since the random number gives an unpredicted reduction and tiles
		// are not in order by their weight, its a nice way to randomly
		// pick something, Larger weighted tiles will have a greater chance of
		// winning out which is what we'd like to happen.
		rnd_weight -= weights[ i ];
		if( rnd_weight < 0 ) return cells[ pos[1] ][ pos[0] ] = [ cell[i] ];	// Replace cell with just the Winning Tile.
	}

	return null;
}

// At a starting cell, check its neighbor cells to see if any tile does NOT
// fit with any of the starting cell's tiles. If any tile is removed from
// a cell, then its neighbors will also be checked in the same way for that
// modified cell. It will then spread like wild fire to any cell that changes
function propagate( start_pos, cells, tiles, rules ){
	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	let pos,
		stack		= [ start_pos ];	// Start our process with a collapsed cell.

	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	// LOCAL FUNCTION AND CONSTANTS
	const UP		= [ 0,-1];
	const RIGHT		= [ 1, 0];
	const DOWN		= [ 0, 1];
	const LEFT		= [-1, 0];
	const DIRS		= [ UP, RIGHT, DOWN, LEFT ];
	const DIR_NAMES	= [ "UP", "RIGHT", "DOWN", "LEFT" ];

	// Shift position in some direction
	let get_dir_pos = ( p, d, out )=>{
		out[ 0 ] = p[0] + d[0];
		out[ 1 ] = p[1] + d[1];
		return !( out[0] < 0 || out[0] >= WIDTH || out[1] < 0 || out[1] >= HEIGHT );
	};

	// Local function to get Tiles from a Cell
	let get_tiles = p=>cells[ p[1] ][ p[0] ];

	// Remove file from the cell matrix
	let remove_tile	= ( p, t )=>{
		let ary = cells[ p[1] ][ p[0] ];
		let idx = ary.indexOf( t );
		if( idx != -1 ) ary.splice( idx, 1 );
		console.log( "---- FILTER", cells[ p[1] ][ p[0] ]  )	;
	};

	//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	let passes = 0,
		dir_name, main_tiles, chk_tiles,  ct, mt, cti,
		idx,  modified, compatible_cnt, key;

	while( (pos = stack.pop()) && passes < PROP_LMT ){
		// Get the Tiles available for the Cell we are going to process.
		main_tiles = get_tiles( pos );
		console.log("------------------------------------------");
		console.log( "- MAIN CELL", pos, main_tiles );

		if( main_tiles.length == 0 ){
			console.log("ERROR - MAIN TILES EMPTY");
			return;
		}

		// We process the cell by checking its neighbor cells from each known direction
		for( idx=0; idx < 4; idx++ ){
			//console.log( DIR_NAMES[ idx ], DIRS[ idx ] );

			//-----------------------------------------
			// Get a Neighbor Cell based on the current direction
			// we are scanning.
			let chk_pos = [0,0];	// Must LET, it gets saved to the stack, else we can cause errors modifing pointers
			dir_name = DIR_NAMES[ idx ];
			if( ! get_dir_pos( pos, DIRS[ idx ], chk_pos ) ){  console.log( "Direction out of bounds", chk_pos ); continue; break; }

			//-----------------------------------------
			// Get all the vailable tiles on the neighbor cell.
			chk_tiles = get_tiles( chk_pos );
			if( chk_tiles.length == 0 ){ console.log("ERROR - CHECK TILES EMPTY"); return; }

			console.log( ":::::");
			console.log( "-- DIR CHECK", dir_name, "OF", main_tiles );
			console.log( "--- CHECK CELL", chk_pos, chk_tiles );

			//-----------------------------------------
			// Loop over all the Neighbor cells, Then check if any of them
			// is allowed to exists at this direction from any of the MAIN CELL's tiles.
			// Since we're deleting from the array by reference, work backwards to not mess up indexing.

			modified = false;
			for( cti = chk_tiles.length-1; cti >=0; cti-- ){ 
				ct = chk_tiles[ cti ];

				//.............................
				// If the Tile is not compatible with NONE of the main tile list
				compatible_cnt = 0;
				for( mt of main_tiles ){	
					key = mt + "_" + ct + "_" + dir_name;  // ex. L_C_UP
					console.log( "---- CHK RULE", key, rules[ key ] );
					//if( !rules[ key ] ) bad_tiles.add( ct );
					if( rules[ key ] ){ compatible_cnt++; break; }
				}

				console.log( "---- COMPATIBLE COUNT:", ct, compatible_cnt );
				//.............................
				// if a tile is NOT compatible with any of the main tiles, Then its worthless
				// so remove it from our tile array. This will effect the array in the cell matrix
				// since the changed is done by reference.
				if( compatible_cnt == 0 ){
					remove_tile( chk_pos, ct );
					modified = true;
				}
			}

			//-----------------------------------------
			// if we had to remove tiles, then add the cell to the stack 
			// because its change, effects it's neighbors.
			if( modified ) stack.push( chk_pos );
			//break;
		}

		passes++;
		//break;
	}
	console.log( "Propagate Pass Count", passes );
}

// How to Render the Cell Matrix Data after the algorithm has done
// its work.
function render( tbl, cells ){
	let x, y, tiles, t,
		rows = tbl.rows;

	for( y=0; y < HEIGHT; y++ ){
		for( x=0; x < WIDTH; x++ ){
			tiles	= cells[y][x];
			td		= rows[y].cells[x];
			t		= ( tiles.length == 0 )? "" : ( tiles.length == 1 )? tiles[0] : tiles.length;

			//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
			td.innerHTML = t;	// View Cell Results
			
			// Color the Table cell based on the CELL Result
			switch( t ){
				case "S": td.className = "TS"; break;
				case "C": td.className = "TC"; break;
				case "L": td.className = "TL"; break;
                case "A": td.className = "TA"; break;
				case "":  td.className = "TERR"; break;
				default:  td.className = ""; break;
			}
		}
	}
}


//###############################################################################
const WIDTH     = 20;
const HEIGHT    = 20;
const TBL		= document.getElementById( "tbl" );

// LIMITS are there for prototyping since I made an infinite loop by accident.
// I also want to limit certain things during testing to easily read the logs.
const PASS_LMT	= 400;	// How many passes to go through the matrix.
const PROP_LMT	= 400;	// How many passes in the propagate to allow

// Generte HTML Table
(_=>{
	let i, r, j;
	for( i=0; i < HEIGHT; i++ ){
		r = TBL.insertRow();
		for( j=0; j < WIDTH; j++ ) r.insertCell().innerHTML = "x";
	}
})();


let rule_matrix = [
    ['S','L','L','L','S','L','L','L'],
    ['S','L','L','L','S','L','L','L'],
    ['S','L','L','L','S','L','L','L'],
    ['C','A','A','A','C','A','A','A'],
    ['S','L','L','L','S','L','L','L'],
    ['S','L','L','L','S','L','L','L'],
    ['S','L','L','L','S','L','L','L'],
];

// let rule_matrix = [
//     ['A','L','L','L','L','L','L','L','A','S',],
//     ['C','A','L','L','L','L','L','A','S','L',],
//     ['L','C','A','L','L','L','A','S','L','L',],
//     ['L','L','C','A','L','A','S','L','L','L',],
//     ['L','L','L','C','A','S','L','L','L','L',],
// ]


function Run(){
	let info	= parse_matrix_rules( rule_matrix ),	// 1. Generate Tiles and Rules
		cells	= gen_cell_matrix( info.tile_ary ),		// 2. Create Matrix with each Cell Filled with all Possible Tiles
		passes	= 0,
		pos;

	do{
		// 3. Find Min Entropy ( Find the cell with the least amount of tile weight );
		// The less the weight, the faster it will collapse, so the idea is to get
		// the easiest ones done first since they have less choices to pick from.
		pos = find_entropy_cell( cells, info.tiles );

		// 2. Collapse that Cell, Basicly means to just randomly pick
		// a tile to use based on whats currently available for that cell.
		collapse_cell( pos, cells, info.tiles );

		// 3. Propagate, The cell we just collapsed, we need to now check all
		// its neighbors to limit the choices of tiles based on the rules. Each cell,
		// that has it's choices reduced gets added to a list to also check its neighbors
		// Its kinda like, once cell got the coronoa, so now you need to check if the people
		// around it has corona, if they have it, gotta check people around them too. If a
		// cell did not get changed, it will not be added to the list, cause it doesn't have corona
		propagate( pos, cells, info.tiles, info.rules );
		passes++;
	}while( !is_all_collapsed( cells ) && passes < PASS_LMT );

	console.log( "PASS COUNT", passes );
	render( TBL, cells );
}

window.addEventListener( "load", Run );