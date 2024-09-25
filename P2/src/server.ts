import express, {NextFunction, Request, Response} from 'express'
import employeeRouter from './api/employee/employee.route'
import reportsRouter from './api/Reports/reports.route';

const PORT = 3001
export class Server {
    private app  = express()

    startServer(){
        // this.app.get('/hello', (req:Request, res:Response)=>{
        //         res.send('Hello!')
        // })
        this.app.use(express.json());
        this.app.use('/employee', employeeRouter)
        this.app.use('/report', reportsRouter)
        //this prints the error in the console rather than in the response
        this.app.use((err:Error, req:Request, res:Response ,next: NextFunction)=>{
            console.log(err.stack)
            res.send(err.message)
            next()
        })
        
        
        this.app.listen(PORT, ()=>{
            console.log(`Listening on the Port ${PORT}`)
        })
    }
}

new Server().startServer()