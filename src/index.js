class Park{
    constructor(screen,floorList){
        this.screen=screen;
        this.floorList=floorList||[];
    }
    addWatcher(watcher){
        this.watcher=watcher;
    }
    carIn(car){
        this.watcher.record(car);
        this.screen.showEmpty(this.floorList);
    }
    carOut(car){
        debugger
        let parkInfo=this.watcher.calculate(car);
        this.screen.showParkTime(parkInfo.carId,parkInfo.parkTime);
    }
}
class Floor{
    constructor(placeList){
        this.placeList=placeList||[];
    }
    getEmptyNum(){

        return this.placeList.filter(place=>place.empty).length;
    }
}
class Place{
    constructor(){
        this.empty = true;
        this.car = null;
    }
    carIn(car){
        this.car=car;
        this.empty=false;
    }
    carOut(){
        this.car=null;
        this.empty=true;
    }
}
class Watcher{
    constructor(park) {
        this.park = park
        this.carList=[]
    }
    watchIn(car){
        this.park.carIn(car)
    }
    watchOut(car){
        this.park.carOut(car)
    }

    record(car){
        debugger
        this.carList.push({carId:car.carId,startTime:new Date()})
    }
    calculate(car){
        let carInfo=this.carList.filter(item=>{
            return item.carId===car.carId
        })[0]
        carInfo.parkTime=new Date()-carInfo.startTime
        return carInfo//{carId,startTime,parkTime}
    }

}
class Screen{
    constructor(){}

    showParkTime(carId,parkTime){
        console.log(`车辆：${carId}  停车时长：${parkTime}`)
    }

    showEmpty(floors){
        floors.forEach((floor,index)=>{
            let emptyNum=floor.getEmptyNum()
            console.log(`第${index}层剩余空车位${emptyNum}`)
        })
    }
}

class Car{
    constructor(carId){
        this.carId=carId;
        this.park=null;
        this.place=null;
    }
    inPark(park){
        this.park=park;
        park.watcher.watchIn(this);
    }
    choosePlace(floorNum,placeNum){
        this.place=this.park.floorList[floorNum].placeList[placeNum]
        this.place.carIn(this)
    }
    outPark(){
        this.place.carOut(this);
        this.place=null;
        this.park.watcher.watchOut(this);
    }
}

function initFloor(placeNum) {
    let placeList=[];
    for(let i=0;i<placeNum;i++)
    {
        placeList.push(new Place())
    }
    return new Floor(placeList)
}

function initPark(floorNum) {
    let floorList=[];
    for(let i=0;i<floorNum;i++){
        floorList.push(initFloor(100))
    }
    const park=new Park(new Screen(),floorList)
    park.addWatcher(new Watcher(park))
    return park
}

function init() {
    car=new Car(1010)
    const park=initPark(3)
    car.inPark(park)
}

let car=null;
init();
car.choosePlace(1,1);
car.outPark();



