class P4{
    constructor(selector){
        this.col =7;
        this.row =6;
        this.selector=selector;
        this.player='red';
        this.drawGame();
        this.ecoute();
        this.checkwin();
    }
    drawGame(){  
        const $jeu = $(this.selector);
        for(let row=0;row < this.row;row++){        
            const $row =$('<div>').addClass('row');
            for (let col=0;col<this.col;col++){
                const $col = $('<div>').addClass('col empty').attr("data-col",col).attr("data-row",row);
                $row.append($col);
            }
            $jeu.append($row)
        }
    }


    //parcours de colonne pour case libre 
    ecoute(){

        const $jeu=$(this.selector);
        const that=this;

        function lastCase(col){

            const $cells = $(`.col[data-col='${col}']`);

            for(let i=$cells.length-1; i>=0;i--){

                const $cell = $($cells[i]);
                if($cell.hasClass('empty')){
                    return $cell;
                }
            }
            return null;
        }
        $jeu.on('mouseenter','.col.empty',function(){
            const $col= $(this).data('col')
            const $last= lastCase($col);
            if($last !=null){
                $last.addClass(`p${that.player}`);
            }

        });
        $jeu.on('mouseleave','.col',function(){
            $('.col').removeClass(`p${that.player}`);
        });

        $jeu.on('click','.col.empty',function(){
            const col = $(this).data('col');
            const $last = lastCase(col);
            $last.addClass(`${that.player}`).removeClass(`empty p${that.player}`).data('player',`${that.player}`);

            const winner=that.checkwin($last.data('row'),$last.data('col'));

            that.player=(that.player==='red')? 'yellow' :'red';

            if (winner){
                window.alert(`les ${winner} ont gagné`)
            }
        });

    }

    checkwin(row,col){
        const that = this;

        function $getCell(i,j){
            return $(`.col[data-row='${i}'][data-col='${j}']`)
        }
        
        function checkDirection(direction){
            let total =0;
            let i = row + direction.i;
            let j = col+direction.j;
            let $next=$getCell(i,j);
            while(i>=0 && i < that.row && j>=0 && j< that.col && $next.data('player')===that.player){
                total++;
                i+= direction.i;
                j+= direction.j;
                $next = $getCell(i,j);
            }
            return total;
        }
        function checkwin(directionA, directionB){
            const total = 1+checkDirection(directionA)+checkDirection(directionB);
            if(total>=4){
                return that.player;
            }else{
                return null;
            }
        }
        function checkhori(){
            return checkwin({i:0,j:-1},{i:0,j:1});
        }
        function checkverti(){
            return checkwin({i:-1,j:0},{i:1,j:0});
        }
        function checkdiag1(){
            return checkwin({i:1,j:1},{i:-1,j:-1});
        }
        function checkdiag2(){
            return checkwin({i:1,j:-1},{i:-1,j:1});
        }
        return checkhori() || checkverti() || checkdiag1() || checkdiag2();
    }
}