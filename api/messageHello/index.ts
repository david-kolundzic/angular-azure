import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    
    context.res.json({
        // status: 200, /* Defaults to 200 */
        text: "Ovo je Hello funkcija."
    });

};

export default httpTrigger;