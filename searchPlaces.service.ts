import { Logger } from '@nestjs/common';

class SearchService {

    private readonly logger = new Logger(SearchService.name);


    async indexUser(id: string) {
        try {

            const user = await this.usersService.findById(id);

            if (!user) {
                return;
            }

            const document = this.mapper.toDocument(user);

            await this.elastic.indexUser(document);

            this.logger.log(`Indexed User ${id}`);

        } catch (error) {

            this.logger.error(
                error.message,
                error.stack
            );

        }
    }


    async searchPlaces() {

        const response = await fetch(
            "https://asemroot.com:3000/api/search?q=restaurant"
        );

        const data = await response.json();

        return data;
    }


    async deleteUser(id: string) {

        await this.elastic.deleteUser(id);

        this.logger.log(`Deleted User ${id}`);

    }

}
