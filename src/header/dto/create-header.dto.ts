import { IsJSON, IsNotEmpty, IsString } from "class-validator";
import { ListDto } from "../../helpers/objectParser";

export class CreateHeaderDto {

    @IsString()
    @IsNotEmpty()
    public name: string;


    @IsJSON()
    @IsNotEmpty()
    public meta_data: string;

}


export class HeaderListDto extends ListDto{}